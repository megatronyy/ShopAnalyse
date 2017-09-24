using System.Xml.Serialization;

namespace ShopAnalyse.OP.Models
{
    [XmlRoot("Config")]
    public class ConfigEntity
    {
        /// <summary>
        /// Css版本号
        /// </summary>
        public string CssVersion
        {
            set;
            get;
        }

        /// <summary>
        /// Js版本号
        /// </summary>
        public string JsVersion { get; set; }
    }
}