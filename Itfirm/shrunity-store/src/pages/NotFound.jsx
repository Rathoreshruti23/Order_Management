import { Link } from 'react-router-dom';
import { EmptyState } from '../components/StateViews';

export default function NotFound() {
  return (
    <div className="container-page py-10">
      <EmptyState title="We can't find that page">
        <p>The link may be old or mistyped.</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </EmptyState>
    </div>
  );
}
