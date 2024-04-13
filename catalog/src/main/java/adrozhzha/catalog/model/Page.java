package adrozhzha.catalog.model;

import java.util.List;

public class Page<T> {
    private List<T> results;
    private int totalCount;

    public Page() {
    }

    public Page(List<T> results, int totalCount) {
        this.results = results;
        this.totalCount = totalCount;
    }

    public List<T> getResults() {
        return results;
    }

    public void setResults(List<T> results) {
        this.results = results;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
}
