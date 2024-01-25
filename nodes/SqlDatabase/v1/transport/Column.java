public class Column {
	public String name;
	public String label;
	public int typeId;
	public int columnIndex;

	Column(int columnIndex, String name, String label, int typeId){
		this.columnIndex = columnIndex;
		this.name = name;
		this.label = label;
		this.typeId = typeId;
	}
}
