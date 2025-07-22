import { DownloadInvoicePDFButton } from "@/components/DownloadInvoicePDFButton";
import { notFound } from "next/navigation";

// Dummy data for demonstration
const invoices: Record<
  string,
  {
    id: string;
    date: string;
    customer: string;
    items: { description: string; amount: number }[];
  }
> = {
  "123": {
    id: "123",
    date: "2024-07-22",
    customer: "John Doe",
    items: [
      { description: "Web Design", amount: 500 },
      { description: "Hosting (1 year)", amount: 100 },
      { description: "Domain (1 year)", amount: 20 },
    ],
  },
  "456": {
    id: "456",
    date: "2024-07-21",
    customer: "Jane Smith",
    items: [{ description: "Consulting", amount: 300 }],
  },
};

export default function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = invoices[params.id];
  if (!invoice) return notFound();
  const total = invoice.items.reduce(
    (sum: number, item: { amount: number }) => sum + item.amount,
    0
  );
  return (
    <div className="max-w-xl mx-auto bg-white p-8 shadow mt-10">
      <h1 className="text-2xl font-bold mb-2">Invoice #{invoice.id}</h1>
      <div className="mb-4 text-gray-600">Date: {invoice.date}</div>
      <div className="mb-4">
        Customer: <span className="font-semibold">{invoice.customer}</span>
      </div>
      <table className="w-full mb-4 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border">Description</th>
            <th className="text-right p-2 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map(
            (item: { description: string; amount: number }, i: number) => (
              <tr key={i}>
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border text-right">
                  ${item.amount.toFixed(2)}
                </td>
              </tr>
            )
          )}
        </tbody>
        <tfoot>
          <tr>
            <td className="p-2 border font-bold text-right">Total</td>
            <td className="p-2 border text-right font-bold">
              ${total.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
      <DownloadInvoicePDFButton invoiceId={invoice.id}>
        Download PDF
      </DownloadInvoicePDFButton>
    </div>
  );
}
