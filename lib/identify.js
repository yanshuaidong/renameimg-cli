const request = require('request-promise')
const path = require('path');
const folderPath = path.resolve('./'); // 当前执行文件所在的文件夹路径
const config = require(`${folderPath}/config.json`)

const AK = config.BDAK
const SK = config.BDSK

function Identify() {
}

Identify.prototype.identifyImg = async function identifyImg(path) {
    const base64img =  getFileContentAsBase64(path);
    var options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + await getAccessToken(),
        'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
        },
        // image 可以通过 getFileContentAsBase64("C:\fakepath\triangle-r-g.png") 方法获取,
        form: {
            'image': base64img
        }
    };
    try {
        let response = await request(options);
        return JSON.parse(response)
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
async function getAccessToken() {
    const options = {
        method: 'POST',
        uri: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
        json: true
    };

    try {
        const response = await request(options);
        return response.access_token;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * 获取文件base64编码
 * @param string  path 文件路径
 * @return string base64编码信息，不带文件头
 */
function getFileContentAsBase64(path) {
    const fs = require('fs');
    try {
        return fs.readFileSync(path, { encoding: 'base64' });
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = Identify;