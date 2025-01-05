
interface Props {
  height: string;
}

export default function Loading({ height }: Props) {

  return(
    <div className="flex justify-center items-center">
      <div className={`loader ${height}`} />
    </div>
  );
}