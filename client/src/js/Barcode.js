// Importation du fichier Websocket permettant d'envoyer les informations vers le côté Java
import { ws } from "./Websocket.js";
export default class Barcode {
    // Lecture par la Webcam
    live(video) {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: video
            },
            decoder: {
                readers: [
                    "ean_reader", // type de code barre qu'on traite
                ],
            }
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });
        Quagga.onDetected(function (result) {
            Quagga.stop();
            console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
            // Envoie le résultat au Websocket
            ws.send(result.codeResult.code);
        });
    }
    // Lecture par image static
    static(img) {
        Quagga.decodeSingle({
            decoder: {
                readers: [
                    "ean_reader", // type de code barre qu'on traite
                ],
            },
            locate: true,
            src: img
        }, function (result) {
            if (result) {
                console.log("result", result);
                // Envoie le résultat au Websocket
                ws.send(result.codeResult.code);
            }
            else {
                let error = document.getElementById("error");
                error.innerHTML = "code barre introuvable";
            }
        });
    }
    // Lecture par input
    input(value) {
        // Le code barre doit être composé de numéro avec une taille de 13
        let regex = new RegExp("^[0-9]{13}$");
        let error = document.getElementById("error");
        regex.test(value) ? ws.send(value) : error.innerHTML = "mauvais format du code barre";
    }
}
//# sourceMappingURL=Barcode.js.map