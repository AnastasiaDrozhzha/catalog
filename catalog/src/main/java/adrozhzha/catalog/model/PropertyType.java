package adrozhzha.catalog.model;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.EnumSet;
import java.util.Objects;

public enum PropertyType {
    STRING("string"),
    NUMBER("number"),
    BOOLEAN("boolean");

    private final String value;

    PropertyType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public static PropertyType fromString(String propertyType) {
        return EnumSet.allOf(PropertyType.class).stream()
                .filter(e -> Objects.equals(e.value, propertyType))
                .findAny()
                .orElseThrow();
    }
}
