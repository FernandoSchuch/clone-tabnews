function status(request, response) {
  response.status(200).json({ retorno: "Escreve qualquer coisa aí!" });
}

export default status;
