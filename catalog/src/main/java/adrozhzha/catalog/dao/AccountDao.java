package adrozhzha.catalog.dao;

import adrozhzha.catalog.db.Tables;
import adrozhzha.catalog.db.tables.records.AccountRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class AccountDao {

    private final DSLContext create;

    public AccountDao(DSLContext dslContext) {
        this.create = dslContext;
    }

    public Optional<String> findUsername() {
        Optional<AccountRecord> result = create.selectFrom(Tables.ACCOUNT).limit(1).fetchOptional();
        return result.map(AccountRecord::getName);
    }
}
