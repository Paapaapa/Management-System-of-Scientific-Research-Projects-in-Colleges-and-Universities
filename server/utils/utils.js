let fs = require("fs");
let path = require("path");

const removeFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) {
            console.log('文件删除失败！'+err);
            return 0;
        }
        console.log("文件删除成功！");
        return 1;
    });
}

module.exports = {
    getUuid: (len, radix) => {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    },
    writeFile: (type,prex, file) => {
        // if (files.length) {
        // files.forEach(file => {
        let des_file = `./upload/${type}/${prex+'_'+file.originalname}`;
        return new Promise((resolve, reject) => {
            fs.readFile(file.path, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                fs.writeFile(des_file, data, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    response = {
                        message: '写入成功',
                        filename: file.originalname
                    };
                    removeFile(file.path);
                    console.log(response);
                    resolve(response);
                });
            });
        });
        // });
        // } else {
        //     console.log('file not found');
        //     return;
        // }
    },
    removeFile
};