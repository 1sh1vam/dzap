import ErrorIcon from './assets/error.svg';

interface ErrorBoxProps {
    errors: string[]
}

const ErrorBox = ({ errors }: ErrorBoxProps) => {
  return (
    <div className="flex gap-4 py-3 px-2 border border-red-500 rounded mt-10">
        <img className="w-6 h-6 mt-[3px]" src={ErrorIcon} />
        <div>
            {errors.map((err, index) => <p key={index} className="text-red-500">{err}</p>)}
        </div>
    </div>
  )
}

export default ErrorBox