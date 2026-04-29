export default function formatDateToUI(apiDate) {
    const date = new Date(apiDate);

    return date.toLocaleDateString('pt-PT'); 
}