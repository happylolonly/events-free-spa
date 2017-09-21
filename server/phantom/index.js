var Horseman = require('node-horseman');
var horseman = new Horseman();

var startURL = 'https://www.onliner.by';



module.exports = function(email, password, work){
  horseman
    .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
    .open(startURL)
    .click('div.auth-bar__item.auth-bar__item--text')
    .waitForNextPage()
    .type('.auth-box__part [type=text]', 'Zik123654')
    // .click('[name=password]')
    // .keyboardEvent('keypress', 16777221)
    .type('.auth-box__part [type=password]', '')
    .click('.auth-box__line--final .auth-box__auth-submit')
    .wait(2000)
    .screenshot("image.png")
    // .waitForNextPage()
    .screenshot("image2.png")
    .cookies()
    .then((cookies)=>{
      console.log(cookies);
      console.log('success?');
      work(cookies);
    })
    .close();
}
