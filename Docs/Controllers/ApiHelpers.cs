using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Linq;

namespace Docs.Controllers
{
    public static class ApiHelpers
    {
        public static string[] GetErrorsArray(this ModelStateDictionary state)
        {
            return state.Values.SelectMany(x => x.Errors.Select(y => Translate(y.ErrorMessage))).ToArray();
        }

        private static string Translate(string errorMessage)
        {
            if (errorMessage.Contains("The field Password"))
            {
                return "Nieprawidłowe hasło (Wymagane 8 znaków, cyfra i duża litera)";
            }

            return string.Empty;
        }
    }
}
