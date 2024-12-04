import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const MySwal = withReactContent(Swal);

export function FireError(message: string) {
  return MySwal.fire({
    title: '¡Error!',
    icon: 'error',
    text: message,
    confirmButtonColor: '#002b49',
  });
}

export function FireSucess(message: string) {
  return MySwal.fire({
    title: '¡Éxito!',
    icon: 'success',
    text: message,
    confirmButtonColor: '#002b49',
  });
}

export async function FireQuestion(
  question: string,
  warning: string,
  confirmText = 'Acepto',
  rejectText = 'Cancelar'
) {
  return MySwal.fire({
    title: question,
    text: warning,
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonColor: '#002b49',
    cancelButtonText: rejectText,
    confirmButtonText: confirmText,
    reverseButtons: true,
  });
}
