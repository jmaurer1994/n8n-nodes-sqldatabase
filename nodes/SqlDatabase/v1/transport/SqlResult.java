import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;

public class SqlResult {
	public List<Column> columns;
	public void parseColumns(ResultSetMetaData rsmd) throws SQLException {
		int columnsCount = rsmd.getColumnCount();

		for(int i = 0; i < columnsCount; i++){
			Column c = new Column(
				i,
				rsmd.getColumnName(i),
				rsmd.getColumnLabel(i),
				rsmd.getColumnType(i)
			);
		}
	}

	public void getData(ResultSetMetaData rsmd) throws SQLException {
		columns.forEach((column) -> {

		});
	}
}
