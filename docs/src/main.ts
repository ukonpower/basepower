// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector((anchor as HTMLAnchorElement).getAttribute('href')!);
    target?.scrollIntoView({ behavior: 'smooth' });
  });
});
