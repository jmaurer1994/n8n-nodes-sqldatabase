import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
/**
 * item {
 *
 * }
 */
public class n8nJdbcConnector {

	private final String jdbcUrl;
	private final String username;
	private final String password;
	private final ExecutorService executorService;
	private final ThreadLocal<Connection> connectionHolder = new ThreadLocal<>();

	public n8nJdbcConnector(String jdbcUrl, String username, String password, int threadPoolSize) {
		this.jdbcUrl = jdbcUrl;
		this.username = username;
		this.password = password;
		this.executorService = Executors.newFixedThreadPool(threadPoolSize);
	}

	private Connection getConnection() throws SQLException {
		Connection conn = connectionHolder.get();
		if (conn == null || conn.isClosed()) {
			conn = DriverManager.getConnection(jdbcUrl, username, password);
			connectionHolder.set(conn);
		}
		return conn;
	}

	public List<SqlResult> executeQueries(List<String> queries) throws Exception {
		List<SqlResult> results = new ArrayList<>();
		List<Callable<SqlResult>> callables = new ArrayList<>();
		for (String query : queries) {
			callables.add(executeQuery(query));
		}
		executorService.invokeAll(callables)
			.stream()
			.map(future -> {
				try {
					return future.get();
				}
				catch (Exception e) {
					throw new IllegalStateException(e);
				}
			})
			.forEach(results::add);
		return results;
	}

	public Callable<SqlResult> executeQuery(String query) {
		return () -> {
			try (
				Statement stmt = getConnection().createStatement();
				ResultSet rs = stmt.executeQuery(query);
			) {
				ResultSetMetaData rsmd = rs.getMetaData();
				int columnCount = rsmd.getColumnCount();

				SqlResult result = new SqlResult();

				result.parseColumns(rsmd);

				result.retrieveData(rsmd);

				return result;
			}
		};
	}
	public void shutdown() {
		executorService.shutdown();
	}
}
