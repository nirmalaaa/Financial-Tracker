export default function IncomeExpensesCard() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col justify-center">
      <h3 className="text-center font-medium mb-4">Expenses and Income</h3>

      <div className="flex justify-around text-center">
        <div>
          <p className="text-2xl font-bold text-black">60%</p>
          <p className="text-sm text-black">Expenses</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-black">40%</p>
          <p className="text-sm text-black">Income</p>
        </div>
      </div>

      <div className="mt-4 w-full bg-gray-300 h-4 rounded-full">
        <div
          className="bg-black h-4 rounded-full"
          style={{ width: "60%" }}
        ></div>
      </div>
    </div>
  );
}
