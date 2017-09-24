using System;
using System.IO;
using System.Text;
using System.Xml;
using System.Xml.Serialization;

namespace ShopAnalyse.OP.Lib.Utils
{
    public class XmlHelper
    {
        public static string ToXml(Object obj)
        {
            string xml = "";
            XmlSerializer serializer = new XmlSerializer(obj.GetType());
            using (MemoryStream mem = new MemoryStream())
            {
                using (XmlTextWriter writer = new XmlTextWriter(mem, Encoding.UTF8))
                {
                    writer.Formatting = Formatting.Indented;
                    XmlSerializerNamespaces n = new XmlSerializerNamespaces();
                    n.Add("", "");
                    serializer.Serialize(writer, obj, n);

                    mem.Seek(0, SeekOrigin.Begin);
                    using (StreamReader reader = new StreamReader(mem))
                    {
                        xml = reader.ReadToEnd();
                    }
                }
            }

            return xml;
        }

        public static T FromXml<T>(string xml)
        {
            Object o = null;
            XmlSerializer serializer = new XmlSerializer(typeof(T), "");
            using (MemoryStream mem = new MemoryStream(Encoding.UTF8.GetBytes(xml)))
            {
                o = serializer.Deserialize(mem);
            }
            return (T)o;
        }


        public static T FromXmlFile<T>(string xmlfile)
        {
            XmlSerializer serializer = new XmlSerializer(typeof(T));
            using (XmlTextReader reader = new XmlTextReader(xmlfile))
            {
                return (T)serializer.Deserialize(reader);
            }
        }
    }
}