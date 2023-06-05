export const goToSlide = (slideIndex: number) =>
  Office.context.document.goToByIdAsync(slideIndex, Office.GoToType.Index, null);
