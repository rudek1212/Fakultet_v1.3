using AutoMapper.QueryableExtensions;
using Docs.Transfer;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Docs.Services
{
    public static class ContextExtensions
    {
        public static async Task<ListDto<T2>> ProjectAndPageAsync<T1, T2>(this IQueryable<T1> queryable, IPagedQuery query)
            where T1 : class
            where T2 : class
        {

            var count = await queryable.CountAsync();

            var items = await queryable.Skip(query.PageIndex * query.PageSize)
                .Take(query.PageSize)
                .ProjectTo<T2>()
                .ToListAsync();

            return new ListDto<T2>()
            {
                Count = count,
                PageSize = query.PageSize,
                PageIndex = query.PageIndex,
                Items = items
            };
        }
    }
}
