namespace Docs.Transfer
{
    public interface IPagedQuery
    {
        int PageIndex { get; set; }

        int PageSize { get; set; }
    }
}
