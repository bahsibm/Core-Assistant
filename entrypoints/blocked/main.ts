import { getWorkMode } from '../../shared/storage';

const countdownEl = document.querySelector<HTMLParagraphElement>('#countdown')!;

function tick(): void {
  void getWorkMode().then((state) => {
    const remaining = state.endsAt - Date.now();
    if (!state.active || remaining <= 0) {
      countdownEl.textContent = 'Süre doldu — çalışma modu bitti.';
      return;
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    countdownEl.textContent = `Kalan süre: ${mins} dk ${secs} sn`;
  });
}

tick();
setInterval(tick, 1000);
