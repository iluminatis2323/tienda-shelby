function alternarTema() {
  const root = document.documentElement;
  const oscuro = root.style.getPropertyValue('--bg-color') === '#000';
  if (oscuro) {
    root.style.setProperty('--bg-color', '#f2f2f2');
    root.style.setProperty('--text-color', '#000');
    root.style.setProperty('--secondary-color', '#ddd');
    root.style.setProperty('--highlight', '#00aa77');
    root.style.setProperty('--primary-color', '#007755');
  } else {
    root.style.setProperty('--bg-color', '#000');
    root.style.setProperty('--text-color', 'white');
    root.style.setProperty('--secondary-color', '#1f1f1f');
    root.style.setProperty('--highlight', '#00ffcc');
    root.style.setProperty('--primary-color', '#00cc99');
  }
}
