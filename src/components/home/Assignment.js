import Link from 'next/link';

export default (props) => {
  const { type } = props;
  const { course } = props;
  const { deadline } = props;
  const { studentid } = props;
  return (
    <div>
      <ion-row>
        <ion-col>
          <div className="" style={{ color: '#373A3C' }}>
            {type}
          </div>
        </ion-col>
        <ion-col>
          <div className="" style={{ color: '#373A3C' }}>
            {course}
          </div>
        </ion-col>
        <ion-col>
          <div className="" style={{ color: '#373A3C' }}>
            {deadline}
          </div>
        </ion-col>
        <ion-col>
          <div className="ion-text-center">
            <Link href="/"><a style={{ color: '#72993E' }}>öffnen</a></Link>
          </div>
        </ion-col>
      </ion-row>
      <ion-row>
        {studentid}
      </ion-row>
    </div>
  );
};
