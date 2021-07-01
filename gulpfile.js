const {series, src, dest, watch} = require("gulp");//watch le podemos decir que archivos pueden estar cambiando y cuando lo hagan que vuelva a ejecutar una tarea

const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin"); //dependencia para minimizar imagenes primero se instala con npm install --save-dev gulp-imagemin
const notify = require("gulp-notify"); // dependencia para informar el estado de un requerimiento npm install --save-dev gulp-notify
const webp = require("gulp-webp"); // dependencia para transformar imagenes a webp npm install --save-dev gulp-webp
const concat = require("gulp-concat"); // sirve para concatenar archivos js ya que a diferencia del css que con solocar el _ ya el editor sabe que un archivo es dependiente de otro aqui hay que hacer la concatenacion npm install --save-dev gulp-concat

                      //Utilidades CSS
//npm install --save-dev autoprefixer postcss gulp-postcss gulp-sourcemaps cssnano
const autoprefixer = require("autoprefixer"); //sirve para agregar prefijos
const postcss = require("gulp-postcss"); //agrega procesamiento a tu css
const cssnano = require("cssnano"); // comprime al minimo el codigo css en una linea
const sourcemaps = require("gulp-sourcemaps");

                      //Utilidades JS
//npm install --save-dev gulp-terser-js gulp-rename
const terser = require("gulp-terser-js");//minifica codigo js
const rename = require("gulp-rename"); //sirve para renombrar o poner sufijos a un archivo

const paths = {
    imagenes: "src/img/**/*",
    scss: "src/scss/**/*.scss", // puedo usar este objeto como paths.imagenes o paths.scss para reemplazar los argumentos de las funciones y no repetir codigo
    js: "src/js/**/*.js" //todos los archivos que esten en js y sus carpetas con extension .js se van a compílar
}

function css() {
    return src("src/scss/app.scss")
    .pipe( sourcemaps.init() ) //identifica donde queda la referencia de los archivos ariginales
    .pipe( sass())
    .pipe( postcss([autoprefixer(),cssnano()] )) //transforma el css con autoprefixer // super util para usarlo hay que crear la hora de configuracion postcss.config.js
    .pipe( sourcemaps.write(".")) //escribe las referencias en un archivo .map para poder ver en que lugar luego queremos hacer cambios
    .pipe( dest("./build/css")) //la compilacion va a la carpeta css
}

function compressedcss() {
    return src("src/scss/app.scss") 
    .pipe( sass({
        outputStyle:"compressed"
    }))
    .pipe( dest("./build/css")) 
}
function javascript() {
    return src(paths.js)
    .pipe( sourcemaps.init() ) //cre al mapa para el achivo comprimido js
    .pipe( concat("bundle.js"))
    .pipe( terser() ) //comprime el codigo como cssnana pero en js
    .pipe( sourcemaps.write(".")) // escribe el .map del js
    .pipe( rename({ suffix: ".min" }))
    .pipe( dest("./build/js")) //la compilacion de la concatenacion va a la carpeta js de build
}
function imagenes () { // funcion para buscar y minimizar todas las imagenes y enviarlas a ina carpeta img en build
    return src("src/img/**/*")
    .pipe( imagemin())
    .pipe( dest("./build/img"))
    .pipe( notify({message: "Imagen Minificada"})) // comando para informar una vez termine de minimizar fotos
} 
function versionWebp () {
    return src("src/img/**/*")
    .pipe (webp())
    .pipe ( dest("./build/img"))
    .pipe( notify({message: "Version webP lista"}))
}
function watchArchivos() {
    watch("src/scss/**/*.scss",css);//esta funcion lo que hace es que escuche permanentemente los cambios que se ejecuten en la ruta destino y ejecutar la funcion css para que se compile solo y ahorrarnos tiempo al querer pararlo o cierro la consola o le doy control+c

    //al colocar el * le estamos diciendo que escuche por todos los achivos que terminen en scss dentro de la carpeta y si hay cambios ejecute la funcion css para verse efectivo hay que parar la funcion si ya esta corriendo y volverla a ejecutar

    // * = la carpeta actual
    // ** = es para visitar todas los archivos de nivel superior que esten en carpetas y tengas la extension scss
    watch(paths.js,javascript);
}
exports.watchArchivos = watchArchivos
exports.css = css 
exports.compressedcss = compressedcss
exports.imagenes = imagenes
exports.versionWebp = versionWebp
exports.javascript = javascript

exports.default = series( css, javascript, imagenes, versionWebp, watchArchivos)
//cuando se pasa por default luego en series solo se pasa el nombre de la funcion

                                //  Importante
//A la hora se subir a produccion no se agregan los node modules eso solo es para produccion, el gulp file tampoco es necesario, la carpeta con los archivos originales no transformados tampoco son necesarios y por ultimo los .map son guias para ti no para el publico  en este caso solo se agrega la carpeta build, video y index