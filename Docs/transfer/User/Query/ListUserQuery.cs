namespace Docs.Transfer.User.Query
{
    public class ListUserQuery : IPagedQuery
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }

        public string SearchBy { get; set; }
    }
}
