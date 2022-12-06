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