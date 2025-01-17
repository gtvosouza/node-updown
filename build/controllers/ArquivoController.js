"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArquivoController = exports.ErroDownload = exports.ErroUpload = void 0;
var mongodb_1 = require("mongodb");
var path_1 = require("path");
var fs_1 = require("fs");
var ErroUpload;
(function (ErroUpload) {
    ErroUpload["OBJETO_ARQUIVO_INVALIDO"] = "Objeto de arquivo inv\u00E1lido";
    ErroUpload["NAO_FOI_POSSIVEL_GRAVAR"] = "N\u00E3o foi poss\u00EDvel gravar o arquivo no banco de dados";
    ErroUpload["SEM_EMPRESA"] = "N\u00E3o existe Empresa";
})(ErroUpload = exports.ErroUpload || (exports.ErroUpload = {}));
var ErroDownload;
(function (ErroDownload) {
    ErroDownload["ID_INVALIDO"] = "ID inv\u00E1lido";
    ErroDownload["NENHUM_ARQUIVO_ENCONTRADO"] = "Nenhum arquivo encontrado com este id";
    ErroDownload["NAO_FOI_POSSIVEL_GRAVAR"] = "N\u00E3o foi poss\u00EDvel gravar o arquivo recuperado";
})(ErroDownload = exports.ErroDownload || (exports.ErroDownload = {}));
var ArquivoController = /** @class */ (function () {
    function ArquivoController(bd) {
        this._bd = bd;
        this._caminhoDiretorioArquivos = path_1.join(__dirname, '..', '..', 'arquivos_temporarios');
        if (!fs_1.existsSync(this._caminhoDiretorioArquivos)) {
            fs_1.mkdirSync(this._caminhoDiretorioArquivos);
        }
    }
    ArquivoController.prototype._ehUmObjetoDeArquivoValido = function (objArquivo) {
        return objArquivo
            && 'name' in objArquivo
            && 'data' in objArquivo
            && objArquivo['name']
            && objArquivo['data'];
    };
    ArquivoController.prototype._inicializarBucket = function (collection) {
        return new mongodb_1.GridFSBucket(this._bd, {
            bucketName: 'arquivos_' + collection
        });
    };
    ArquivoController.prototype.realizarUpload = function (objArquivo, collection) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (collection === "undefined") {
                reject(ErroUpload.SEM_EMPRESA);
            }
            else {
                if (_this._ehUmObjetoDeArquivoValido(objArquivo)) {
                    var bucket = _this._inicializarBucket(collection);
                    var nomeArquivo = objArquivo['name'];
                    var conteudoArquivo = objArquivo['data'];
                    var nomeArquivoTemp = nomeArquivo + "_" + (new Date().getTime());
                    var caminhoArquivoTemp_1 = path_1.join(_this._caminhoDiretorioArquivos, nomeArquivoTemp);
                    fs_1.writeFileSync(caminhoArquivoTemp_1, conteudoArquivo);
                    var streamGridFS_1 = bucket.openUploadStream(nomeArquivo, {
                        metadata: {
                            mimetype: objArquivo['mimetype']
                        }
                    });
                    var streamLeitura = fs_1.createReadStream(caminhoArquivoTemp_1);
                    streamLeitura
                        .pipe(streamGridFS_1)
                        .on('finish', function () {
                        fs_1.unlinkSync(caminhoArquivoTemp_1);
                        resolve(new mongodb_1.ObjectId("" + streamGridFS_1.id));
                    })
                        .on('error', function (erro) {
                        console.log(erro);
                        reject(ErroUpload.NAO_FOI_POSSIVEL_GRAVAR);
                    });
                }
                else {
                    reject(ErroUpload.OBJETO_ARQUIVO_INVALIDO);
                }
            }
        });
    };
    ArquivoController.prototype.realizarDownload = function (id, collection) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _id, bucket, resultados, metadados, streamGridFS, caminhoArquivo_1, streamGravacao;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id && id.length == 24)) return [3 /*break*/, 2];
                        _id = new mongodb_1.ObjectId(id);
                        console.log(collection);
                        bucket = this._inicializarBucket(collection);
                        return [4 /*yield*/, bucket.find({ '_id': _id }).toArray()];
                    case 1:
                        resultados = _a.sent();
                        if (resultados.length > 0) {
                            metadados = resultados[0];
                            streamGridFS = bucket.openDownloadStream(_id);
                            caminhoArquivo_1 = path_1.join(this._caminhoDiretorioArquivos, metadados['filename']);
                            streamGravacao = fs_1.createWriteStream(caminhoArquivo_1);
                            streamGridFS
                                .pipe(streamGravacao)
                                .on('finish', function () {
                                resolve(caminhoArquivo_1);
                            })
                                .on('erro', function (erro) {
                                console.log(erro);
                                reject(ErroDownload.NAO_FOI_POSSIVEL_GRAVAR);
                            });
                        }
                        else {
                            reject(ErroDownload.NENHUM_ARQUIVO_ENCONTRADO);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        reject(ErroDownload.ID_INVALIDO);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return ArquivoController;
}());
exports.ArquivoController = ArquivoController;
