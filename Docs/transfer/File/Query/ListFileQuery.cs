using Docs.Transfer;

namespace Docs.Transfer.File.Query
{
    public class ListFileQuery : IPagedQuery
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }

        public string SearchBy { get; set; }

        public FileType? FileType { get; set; }

        public FileState? FileState { get; set; }
    }
}
