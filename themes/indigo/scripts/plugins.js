const { version, name } = require('../package.json')

hexo.extend.helper.register('theme_version', () => version)

const source = (path, cache, ext) => {
    if (cache) {
        const minFile = `${path}${ext === '.js' ? '.min' : ''}${ext}`
        return hexo.theme.config.cdn ? `//unpkg.com/${name}@latest${minFile}` : `${minFile}?v=${version}`
    } else {
        return path + ext
    }
}
hexo.extend.helper.register('theme_js', (path, cache) => source(path, cache, '.js'))
hexo.extend.helper.register('theme_css', (path, cache) => source(path, cache, '.css'))

hexo.extend.tag.register('echarts', ([height = 400, width = '85%'], option) => {
    var id = 'echarts' + ((Math.random() * 9999) | 0);
    return `<div id="${id}" style="width: ${width};height: ${height}px;margin: 0 auto"></div>` +
    '<script src="//echarts.baidu.com/dist/echarts.common.min.js"></script>' +
    '<script type="text/javascript">' +
        `var myChart = echarts.init(document.getElementById('${id}'));` +
        `var option = ${option}` +
        'myChart.setOption(option);' +
    '</script>';
}, {async: true, ends: true});

const pinyin = require("pinyin");

hexo.extend.tag.register('ruby', function(args) {
    var splited = args.join(' ').split('|');
    var origin = splited[0].trim();
    var ruby = origin;
    var lang = '';
    var convert = true;
    if (splited.length > 1) {
        ruby = splited[1].trim();
        if (splited.length > 2) {
            lang = splited[2].trim();
        }
        convert = !!(splited[3]);
    }
    if (convert) {
        ruby = [].concat.apply([],pinyin(ruby, {
            segment: true
        })).join(' ');
    }
    var ruby_result = (lang ? "<ruby lang='" + lang + "'>" : "<ruby>") +
        origin + "<rp> (</rp><rt>" + ruby + "</rt><rp>) </rp></ruby>";
    return ruby_result;
});

function renderImage(src, alt = '', title = '') {
    return `<figure class="image-bubble">
                <div class="img-lightbox">
                    <div class="overlay"></div>
                    <img src="${src}" alt="${alt}" title="${title}" />
                </div>
                <div class="image-caption">${title || alt}</div>
            </figure>`
}

hexo.extend.tag.register('image', ([src, alt = '', title = '']) => {
    return hexo.theme.config.lightbox ? renderImage(src, alt, title) : `<img src="${src}" alt="${alt}" title="${title}" />`
})

hexo.extend.filter.register('before_post_render', data => {
    if (hexo.theme.config.lightbox) {
        // 包含图片的代码块 <escape>[\s\S]*\!\[(.*)\]\((.+)\)[\s\S]*<\/escape>
        // 行内图片 [^`]\s*\!\[(.*)\]\((.+)\)([^`]|$)
        data.content = data.content.replace(/<escape>.*\!\[(.*)\]\((.+)\).*<\/escape>|([^`]\s*|^)\!\[(.*)\]\((.+)\)([^`]|$)/gm, match => {

            // 忽略代码块中的图片
            if (/<escape>[\s\S]*<\/escape>|.?\s{3,}/.test(match)) {
                return match
            }

            return match.replace(/\!\[(.*)\]\((.+)\)/, (img, alt, src) => {
                const attrs = src.split(' ')
                const title = (attrs[1] && attrs[1].replace(/\"|\'/g, '')) || ''
                return `{% image ${attrs[0]} '${alt}' '${title}' %}`
            })
        })
    }
    return data
})
