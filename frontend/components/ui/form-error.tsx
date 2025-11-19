export const FormError = ({ error }: { error?: string[] }) => {
  if (!error) return null;
  return error.map((err, i) => (
    <p key={i} className="text-red-500">
      {err}
    </p>
  ));
};
