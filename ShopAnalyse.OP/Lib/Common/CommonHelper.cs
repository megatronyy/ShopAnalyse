using System.Collections.Generic;
using System.Data;
using BitAuto.EP.MaiChe.Utils;

namespace ShopAnalyse.OP.Lib.Common
{
    /// <summary>
    /// 公用帮助类
    /// </summary>
    public class CommonHelper
    {
        public static E GetEntityByDataRow<E>(DataRow dr) where E : class, new()
        {
            E entity = null;
            if (dr != null)
            {
                entity = new E();
                FormHelper.GetInstance().BindDataRowToEntity(entity, dr);
            }
            return entity;
        }
        public static List<E> GetListEntityByDataSet<E>(DataSet ds) where E : class, new()
        {
            List<E> list = null;
            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                list = new List<E>();
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    E entity = new E();
                    FormHelper.GetInstance().BindDataRowToEntity(entity, dr);
                    if (entity != null)
                    {
                        list.Add(entity);
                    }
                }
            }
            return list;
        }
        public static List<E> GetListEntityByDataTable<E>(DataTable dt) where E : class, new()
        {
            List<E> list = null;
            if (dt != null && dt.Rows.Count > 0)
            {
                list = new List<E>();
                foreach (DataRow dr in dt.Rows)
                {
                    E entity = new E();
                    FormHelper.GetInstance().BindDataRowToEntity(entity, dr);
                    if (entity != null)
                    {
                        list.Add(entity);
                    }
                }
            }
            return list;
        }
    }
}