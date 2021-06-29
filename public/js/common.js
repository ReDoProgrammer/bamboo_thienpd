// (function ($) {
//   "use strict";
//   // lazy load
//   $(".lazy").lazy({
//     placeholder:
//       "data:image/gif;base64,R0lGODlhAAL7APUAAAAAAB0rcjeDpUep1kes2kqOsyc6mUaEpiEyg1an01qt2yAwf0mLsB8ve0+x4FGWvik9oUWGqlSr2ER/oEqr2Uuw302SuSg8n1Cx4DmJrh4td0qp1Umu3EyQtig7nCQ1jFeq11yw3iAvfFmr2EOCpUWJrQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACzbAHQATAAVAAAG/0CAcEgsGo/IpHK5/Fye0Kj0glA+ONisdsvpWLngrAWA8JjP6PRZgyxs3vC4/K0gIRnzfFwRWRj+gIGCBmYBSCUDiYqLjHATSBGMkpMkfoOXgYZHGZOdio+bnp4ClpiYmkacopOgRpGrkqSmpqhFqrCLrba4jLKzl7VEt7wDusLEir6/gsFDw7zGQ6/IysuAzULPuNHZyInV1gbYANqw3OTeA+DW4+Wr5+6i68vt6fDp87/13vfe+bP7kPWjViqcOCTxPJ2bRuwfLYT2IPorGI7NkQLIFCg4cMgbHwQG/zRQYoHYiAJKOiBDCeCDmpdnRiaxEKKCzZs4cXpJGcKBgw2cQCuMYUK0qNGjR4IAACH5BAkKAAAALNsAdABMABUAhQAAAB4sdDeDpVKZwUep1k+x4DuMsUuw31eq1yc6mUWGqker2U6UuyExgkuOtFWr2Ck9oUes2h8ueUN9nig8n0mLsE2SuVqt21an00qp1VCx4Vyw3ig7nDmIrEqr2VCVvSM1ikuQtlmr2Emu3CAvfUOBpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb/QIBwSCwaj8ikcrkcjJ7QqHTkUIIo2Kx2S2koP9Mw1AIIZc5nj3qtJrgvlxKywanb73g7CVlBu/+AgCIiCgaBh4BoE0gkCY6PkJGPAUgKiJd/JYaYl4tHjZKhkJRHHZyXApungZ5GoKKipEamq4GptayMsLCyRbS4brfAbq1Fr7uRvUS/wMLDxUTHyJNIzLjOwNBD0tMJykPWtdi42kLc099C4avjteUA58jpAOun7avv8bvz9Zz3p/m6Jas2LJiqbLoEUitVkMA/TgEVOuLX8CGmiBIpFhQQYhgcOZ8kTuTTUAEAC8BEVJkj0lsSBylDCPmwQYNNDQdy6sxpc2WSFStcgmLxkiTEzqNIyTBZyrSp0yNBAAAh+QQFCgAAACzbAHQATAAVAIUAAAAeLXZDfZ5SmcFHqdY7jLFQseFKsN8nOplXqtdGhKZOlLshMoNHq9lLjrMpPaFUq9gfL3tEf6AoPJ86iq9Kr95MkrlbrdtWp9NKqdZcsN4oO5xRl78jNIlKq9lLkLZaq9ggMH9EgqRFia0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/0CAcEgsGo/IpHK5HFSe0Gj0cnEoOdKs9KPsTL7gsHjCAHwyaIJ6zV5TRUgHOtOuo9/I0GbP7/v5EQVpdYRqAkgjhYoEEkgRCJCRkpORAQWLhYdHFJiEmkaPlKKSlp11n0WcpmxwR6Gjo6Wra6hEqrMEtUOvsJSyuLpCt7OtoL2xl7i5SMOrwQC8x5XJwMzKy67SvtSzz82mxUXR2r/d1srP49Llzue4jdnapNztm9fwxvLT1973jvr70LmbhU8cQEjsTPVTVpCIumMBHCi7EI6IRFwXFOQ5iCAAAAu4rCT5EFIJg4MRACzQcKCly5cvRSaxwBKmzZZcTI7ZCaYMkwefQIMKNRIEADs=",
//   });
//   // Check email
//   function isEmail(email) {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(email);
//   }
//   // Check number
//   function isNum(number) {
//     var charCode = number.which ? number.which : number.keyCode;
//     return !(charCode > 31 && (charCode < 48 || charCode > 57));
//   }
//   // Menu mobile
//   $("nav#menu-mobi").mmenu({});
//   // Active menu
//   $(".menu-top ul li a").each(function () {
//     var current_page_URL = location.href;
//     if ($(this).attr("href") !== "#") {
//       var target_URL = $(this).prop("href");
//       if (target_URL == current_page_URL) {
//         $(".menu-top ul li a").parent("li").removeClass("active");
//         $(this).parent("li").addClass("active");
//       }
//     }
//   });
//   // Fixed menu top
//   var heightTop = jQuery(".header-top").outerHeight();
//   jQuery(window).scroll(function () {
//     var scrollTop = jQuery(this).scrollTop();
//     var w = window.innerWidth;
//     if (scrollTop > heightTop) {
//       jQuery(".header").addClass("fadeInDown fixed");
//     } else {
//       jQuery(".header").removeClass("fadeInDown fixed");
//     }
//   });
//   // Scroll to top
//   $(window).scroll(function () {
//     if ($(this).scrollTop() >= 200) {
//       $("#return-to-top").addClass("td-scroll-up-visible");
//     } else {
//       $("#return-to-top").removeClass("td-scroll-up-visible");
//     }
//   });
//   $("#return-to-top").click(function () {
//     $("body,html").animate(
//       {
//         scrollTop: 0,
//       },
//       "slow"
//     );
//   });
// })(jQuery);


function getBaseUrl() {
  return window.location.protocol + "//" + window.location.host;
}

function getACCESS_TOKEN(){
  return localStorage.getItem("ACCESS_TOKEN");
}

 //hàm lấy chuỗi tiếng việt không dấu, được ngăn cách với nhau bằng dấu -
 function getMeta(title) {
  return title.toLowerCase().trim()//đưa hết về kiểu chữ thường và loại bỏ khoảng trống thừa đầu và cuối của chuỗi                    
          .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
          .replace(/\ /g, '-').replace(/đ/g, "d")
          .replace(/đ/g, "d")
          .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
          .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
          .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o")
          .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e")
          .replace(/ì|í|ị|ỉ|ĩ/g, "i")
          .replace(/\s+/g, '-')           // thay thế khoảng trắng bằng dấu - 
          .replace(/&/g, '-va-')         // thay thế kí tự & bằng -va-
          .replace(/[^\w\-]+/g, '')       // loại bỏ các khoảng trắng thừa
          .replace(/\-\-+/g, '-');         // thay thế các kí tự - liên tục bằng 1 kí tự -w
 }