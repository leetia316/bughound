# 需求提报系统

![header](header.png)

- 主色：#FF4400 (255, 68, 0)
- 对比色：#252535 (37, 37, 53)
- 完成色：#009966 (0, 153, 102)

## 部署指引

``` bash
git clone https://github.com/o2team/bughound.git

cd bughound

npm install

# 手动创建文件夹，嗯手动
mkdir database/data
mkdir upload

# 启动 Mongodb
mongod --dbpath database/data
# 手动添加第一个管理员用户，嗯手动，看下./database/index.js里的数据结构

# 运行
node server
```
