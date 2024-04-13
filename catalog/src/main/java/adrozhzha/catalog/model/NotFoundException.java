package adrozhzha.catalog.model;

public class NotFoundException extends RuntimeException {

    private final String type;
    private final Integer id;

    public NotFoundException(String type, Integer id) {
        super(String.format("%s with id %s not found", type, id));
        this.type = type;
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public Integer getId() {
        return id;
    }
}
