package adrozhzha.catalog.dao;

import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.tools.StringUtils;

import static org.jooq.impl.DSL.condition;
import static org.jooq.impl.DSL.inline;

public class Utils {

    private Utils() {

    }

    /**
     * Returns full text search condition for the given field and search terms.
     *
     * @param field Field.
     * @param terms Search terms.
     * @return full text search condition for the given field and search terms.
     */
    public static Condition fullTextSearch(Field<?> field, String terms) {
        return condition("to_tsvector(?) @@ plainto_tsquery(?)", field.getQualifiedName(), inline(terms));
    }

    /**
     * Returns full text search condition if terms is not blank string, else returns condition that is always true
     * to return all records.
     *
     * @param field Field.
     * @param terms Search terms.
     * @return full text search condition if terms is not blank string, else returns condition that is always true
     * to return all records.
     */
    public static Condition search(Field<?> field, String terms) {
        if (StringUtils.isBlank(terms)) {
            return condition(Boolean.TRUE.toString());
        } else {
            return fullTextSearch(field, terms);
        }
    }
}
