export default function NoShopDiv(pageName: string) {
  return (
    <div className="p-24 text-center">
      <h2 className="text-xl font-semibold">No Shop Selected</h2>
      <p className="text-muted-foreground">
        Please select a shop from the header to view {pageName}.
      </p>
    </div>
  );
}
