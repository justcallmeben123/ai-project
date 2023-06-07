# ai-project
juzhou project


1.安装node js

https://nodejs.org/dist/v16.16.0/win-x64/node.exe


2.通过打开文件夹的cmd， 输入node -v查看node.js有没有装好

3.进入terminal，ai-project栏， 安装npm后，输入npm yarn install

4输入yarn install 安装依赖

5输入yarn run dev -o 直接打开， 或者点击端口http://localhost:3000/ 


上传本地文件到github

第一步：建立git仓库，cd到你的本地项目根目录下，执行git命令

git init
第二步：将项目的所有文件添加到仓库中

git add .
第三步：将add的文件commit到仓库

git commit -m "注释语句"
第四步：去github上创建自己的Repository，创建后的页面如下图所示：


点击Clone or download按钮，复制弹出的地址git@github.com:***/test.git，记得要用SSH的地址，尽量不要用HTTPS的地址，如上图所示

第五步：将本地的仓库关联到github上---把上一步复制的地址放到下面

git remote add origin git@github.com:***/test.git
第六步：上传github之前，要先pull一下，执行如下命令：

git pull origin master
第七步，上传代码到github远程仓库

git push -u origin master
祝你成功！