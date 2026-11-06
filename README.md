# 万校教练工作台

无需登录的静态教学网站。包含完整正课与试课话术、培训资料、单词复习表下载与修改，以及带24组轮换中英文寄语的家长微信反馈生成器。

## 发布到 GitHub Pages

1. 在自己的 GitHub 账号下创建仓库，例如 wanxiao-coach。
2. 将本目录全部文件上传至仓库 main 分支，包括隐藏的 .github/workflows/pages.yml。
3. 进入仓库 Settings → Pages，将 Source 设为 GitHub Actions。
4. 在 Actions 中运行 Publish Wanxiao Coach Site，或再次推送 main 分支。
5. 部署成功后，在 Settings → Pages 查看真实网站地址。通常为 https://用户名.github.io/仓库名/，实际以GitHub返回地址为准。

无需构建命令、数据库、第三方API或独立服务器。所有页面与资源使用相对路径，支持仓库子目录网址。

也可以不使用工作流，在 Settings → Pages 中选择 Deploy from a branch，指定 main 分支和 /(root) 目录。

## 隐私

学生姓名、成绩、备注和生成文案仅保留在当前页面内存中。仅寄语轮换序号保存在浏览器本机。网站不会将学生输入上传至GitHub或其他服务。公开仓库仅应保存网站源文件与公开教学素材，禁止添加学生记录、账号口令或密钥。

Github Pages的大陆直连表现需在发布后实际验证，不保证所有地区及运营商均可访问。
