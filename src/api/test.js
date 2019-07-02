$('.view-video-pdf').click(function(){
  if(cookie('auth_id') == ""){
      _reg('登录包图网', '登录后可收藏');
      return false;
  }

  $('.pdf-wrap').show();
  var content = '<div style="width: 520px;margin: 0 auto;">\n' +
      '  <h1 style="font-weight:normal; margin:0pt 0pt 10pt; orphans:0; page-break-after:avoid; page-break-inside:avoid; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:36pt; font-weight:bold">包图视频</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:36pt; font-weight:bold">模板使用教程</span></h1>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="background-color:#ffff00; font-family:微软雅黑; font-size:10.5pt; font-weight:bold">替换图片、替换文字、输出视频</span>\n' +
      '    <span style="background-color:#ffff00; font-family:微软雅黑; font-size:10.5pt">教程，请戳↓↓↓</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:Calibri; font-size:10.5pt">A</span>\n' +
      '    <span style="font-family:Calibri; font-size:10.5pt">E</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">模板使用教程</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">：</span>\n' +
      '    <a style="color:#800080" target="_blank" href="https://www.bilibili.com/video/av35486168">\n' +
      '      <span style="color:#800080; font-family:Calibri; font-size:10.5pt; text-decoration:underline">https://www.bilibili.com/video/av35486168</span></a>\n' +
      '  </p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:Calibri; font-size:10.5pt">P</span>\n' +
      '    <span style="font-family:Calibri; font-size:10.5pt">R</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">模板使用教程</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">：</span>\n' +
      '    <a style="color:#800080" target="_blank" href="https://www.bilibili.com/video/av35486376">\n' +
      '      <span style="color:#800080; font-family:Calibri; font-size:10.5pt; text-decoration:underline">https://www.bilibili.com/video/av35486376</span></a>\n' +
      '  </p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">会声会影使用教程</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">：</span>\n' +
      '    <a style="color:#800080" target="_blank" href="https://www.bilibili.com/video/av35485856">\n' +
      '      <span style="color:#800080; font-family:Calibri; font-size:10.5pt; text-decoration:underline">https://www.bilibili.com/video/av35485856</span></a>\n' +
      '  </p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">包图视频用户交流群：</span>\n' +
      '    <span style="font-family:Calibri; font-size:10.5pt">535343754（群满则请直接添加微信公众号）</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">包图视频微信公众号：</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <img src="https://js.ibaotu.com/revision/plugins/pdf/videoTutorialImg/cdd7fc0e-6e31-4022-9d6c-e7637d7c63ce.001.jpeg?v=12" width="171" height="171" alt="二维码" style="-aw-left-pos:-7.5pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:0.4pt; -aw-wrap-type:topbottom" />\n' +
      '    <br /></p>\n' +
      '  <h2 style="font-size:18pt; font-weight:normal; line-height:172%; margin:0pt 0pt 10pt; orphans:0; page-break-after:avoid; page-break-inside:avoid; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:18pt; font-weight:bold">一、</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:18pt; font-weight:bold">A</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:18pt; font-weight:bold">e</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:18pt; font-weight:bold">模板常见问题</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:18pt; font-weight:bold">解决</span></h2>\n' +
      '  <h3 style="font-size:12pt; line-height:172%; margin:0pt 0pt 10pt; orphans:0; page-break-after:avoid; page-break-inside:avoid; widows:0">\n' +
      '    <span style="font-family:Calibri; font-size:12pt; font-weight:bold">01</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:12pt; font-weight:bold">素材丢失</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:12pt; font-weight:bold">问题</span></h3>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">错误提示：</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <img src="https://js.ibaotu.com/revision/plugins/pdf/videoTutorialImg/cdd7fc0e-6e31-4022-9d6c-e7637d7c63ce.002.png" width="398" height="168" alt="" style="-aw-left-pos:0.65pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:5.45pt; -aw-wrap-type:topbottom" />\n' +
      '    <br />\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">错误</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">原因：模板文件中需要调用的素材路径发生了改变</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; text-align:justify; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">解决教程：</span>\n' +
      '    <a style="color:#800080" target="_blank" href="https://www.bilibili.com/video/av35485951">\n' +
      '      <span style="color:#800080; font-family:Calibri; font-size:10.5pt; text-decoration:underline">https://www.bilibili.com/video/av35485951</span></a>\n' +
      '  </p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt">\n' +
      '    <span style="font-family:Calibri; font-size:10.5pt">&#xa0;</span></p>\n' +
      '  <h3 style="font-size:12pt; line-height:172%; margin:0pt 0pt 10pt; orphans:0; page-break-after:avoid; page-break-inside:avoid; text-align:justify; widows:0">\n' +
      '    <span style="font-family:Calibri; font-size:12pt; font-weight:bold">02</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:12pt; font-weight:bold">字体解析</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:12pt; font-weight:bold">错误问题</span></h3>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">错误提示图：</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <img src="https://js.ibaotu.com/revision/plugins/pdf/videoTutorialImg/cdd7fc0e-6e31-4022-9d6c-e7637d7c63ce.003.png" width="396" height="378" alt="图片1" style="-aw-left-pos:-3.75pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:3.35pt; -aw-wrap-type:topbottom" />\n' +
      '    <br />\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">错误</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">原因：字体解析错误是因为电脑中缺少模板内的字体</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">解决方法：点确定，软件自行替换字体</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">。</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">如</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">需预览视频同款字体，可搜索红框内字体进行下载</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">小贴士：</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">包图网·</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">版权</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">字体下载（</span>\n' +
      '    <a style="color:#0563c1" target="_blank" href="https://ibaotu.com/?m=Font">\n' +
      '      <span style="color:#0563c1; font-family:Calibri; font-size:10.5pt; text-decoration:underline">https://ibaotu.com/?m=Font</span></a>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">）</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">总有一款适合您！</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; widows:0">\n' +
      '    <span style="font-family:Calibri; font-size:10.5pt">&#xa0;</span></p>\n' +
      '  <h3 style="font-size:12pt; line-height:172%; margin:0pt 0pt 10pt; orphans:0; page-break-after:avoid; page-break-inside:avoid; text-align:justify; widows:0">\n' +
      '    <span style="font-family:Calibri; font-size:12pt; font-weight:bold">03</span>\n' +
      '    <span style="font-family:微软雅黑; font-size:12pt; font-weight:bold">提示表达式错误</span></h3>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; text-align:justify; widows:0">\n' +
      '    <span style="font-family:微软雅黑; font-size:10.5pt">错误提示：</span></p>\n' +
      '  <p style="line-height:10.5pt; margin:0pt 0pt 10pt; orphans:0; text-align:justify; widows:0">\n' +
      '    <img src="https://js.ibaotu.com/revision/plugins/pdf/videoTutoria…