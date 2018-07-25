const request = require('request')
const cheerio = require('cheerio')

function Movie() {
    this.name = ''
    this.score = 0
    this.quote = ''
    this.ranking = 0
    this.coverUrl = ''
}

const getMovieFromDiv = div => {
    const movie = new Movie()
    const load = cheerio.load(div)
    const pic = load('.pic')
    movie.name = load('.title').text()
    movie.score = load('.rating_num').text()
    movie.quote = load('.inq').text()
    movie.ranking = pic.find('em').text()
    movie.coverUrl = pic.find('img').attr('src')
    return movie
}

const saveMovie = (movies) => {
    const fs = require('fs')
    const path = 'DouBanTop25.json'
    const s = JSON.stringify(movies, null, 2)
    fs.writeFile(path, s, (error) => {
        if (error === null) {
            console.log('保存成功')
        } else {
            console.log('保存文件错误', error)
        }
    })
}


const getMoviesFromUrl = (url) => {
    request(url, (error, response, body) => {
        if (error === null && response.statusCode == 200) {
            const load = cheerio.load(body)
            const movies = []
            const movieDiv = load('.item')
            for(let i = 0; i < movieDiv.length; i++) {
                let element = movieDiv[i]
                const div = load(element).html()
                const movie = getMovieFromDiv(div)
                // console.log(movie)
                movies.push(movie)
            }
            saveMovie(movies)
        } else {
            console.log('请求失败 ', error)
        }
    })
}


const main = () =>{
    const url = 'https://movie.douban.com/top250'
    getMoviesFromUrl(url)
}


main()