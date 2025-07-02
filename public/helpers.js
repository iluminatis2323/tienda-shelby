function mostrarNotificacion(msg) {
  const n = document.getElementById("notificacion");
  n.textContent = msg;
  n.style.display = "block";
  setTimeout(() => n.style.display = "none", 2000);
}
