using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace ShopAnalyse.OP.Lib.Common
{
    public class ImageThumbHelper
    {
        public static void GetThumb(string inputPath, int width, int height, string outputPath)
        {
            FileStream fs = new FileStream(inputPath, FileMode.Open);
            System.Drawing.Image originalImage = System.Drawing.Image.FromStream(fs);
            fs.Close();
            fs.Dispose();
            GetThumb(originalImage, width, height, outputPath);
        }

        public static void GetThumb(Image originalImage, int width, int height, string outputPath)
        {
            int x, y, w, h;
            if (originalImage.Width > width && originalImage.Height > height)
            {
                w = width;
                h = width * originalImage.Height / originalImage.Width;
                if (h > height)
                {
                    h = height;
                    w = height * originalImage.Width / originalImage.Height;
                    x = (width - w) / 2;
                    y = 0;
                }
                else
                {
                    x = 0;
                    y = (height - h) / 2;
                }
            }
            else if (originalImage.Width > width)
            {
                w = width;
                h = width * originalImage.Height / originalImage.Width;
                x = 0;
                y = (height - h) / 2;
            }
            else if (originalImage.Height > height)
            {
                h = height;
                w = height * originalImage.Width / originalImage.Height;
                x = (width - w) / 2;
                y = 0;
            }
            else
            {
                w = originalImage.Width;
                h = originalImage.Height;
                x = (width - w) / 2;
                y = (height - h) / 2;
            }
            Bitmap bm = new Bitmap(width, height);
            Graphics g = Graphics.FromImage(bm);

            // 指定高质量、低速度呈现。
            g.SmoothingMode = SmoothingMode.HighQuality;
            // 指定高质量的双三次插值法。执行预筛选以确保高质量的收缩。此模式可产生质量最高的转换图像。
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;

            g.Clear(Color.White);
            g.DrawImage(originalImage, new Rectangle(x, y, w, h), 0, 0, originalImage.Width, originalImage.Height, GraphicsUnit.Pixel);

            long[] quality = new long[1];
            quality[0] = 100;

            System.Drawing.Imaging.EncoderParameters encoderParams = new System.Drawing.Imaging.EncoderParameters();
            System.Drawing.Imaging.EncoderParameter encoderParam = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
            encoderParams.Param[0] = encoderParam;
            ImageCodecInfo[] arrayICI = ImageCodecInfo.GetImageEncoders();//获得包含有关内置图像编码解码器的信息的ImageCodecInfo 对象。
            ImageCodecInfo jpegICI = null;
            for (int i = 0; i < arrayICI.Length; i++)
            {
                if (arrayICI[i].FormatDescription.Equals("JPEG"))
                {
                    jpegICI = arrayICI[i];//设置JPEG编码
                    break;
                }
            }
            if (jpegICI != null)
            {
                bm.Save(outputPath, jpegICI, encoderParams);
            }

            bm.Dispose();
            originalImage.Dispose();
            g.Dispose();
        }
    }
}