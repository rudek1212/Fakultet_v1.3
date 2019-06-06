using System.Collections.Generic;

namespace Docs.Transfer
{
    public class ListDto<T> where T : class
    {
        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public int Count { get; set; }

        public ICollection<T> Items { get; set; }

    }
}
