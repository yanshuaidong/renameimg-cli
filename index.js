#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const Translator = require('./lib/translator');
const Identify = require('./lib/identify');
const folderPath = path.resolve('./'); // 当前执行文件所在的文件夹路径


let translator = new Translator();
let identifyor = new Identify();

async function main() {
    fs.readdir(folderPath, async (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }
        // 过滤出图片文件
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpeg', '.jpg'].includes(ext);
        });
        for (const file of imageFiles) {
            const filePath = path.join(folderPath, file);
            console.log(filePath);
            try {
                // 在这里可以对图片数据进行处理
                let identify = await identifyor.identifyImg(filePath);
                console.log('图片识别结果', identify.result[0].keyword);
                let resultStr = await translator.translate(identify.result[0].keyword);
                console.log('图片翻译结果：', resultStr.translation[0]);
                fs.rename(filePath, `${folderPath}/${resultStr.translation[0]}.png`, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('文件重命名成功！');
                    }
                });
            } catch (err) {
                console.error('Error reading file:', err);
            }
        }
    });
}

main()









