function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

export default stripHtml;
