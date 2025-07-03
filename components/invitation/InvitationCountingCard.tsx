import { Card, CardContent } from '@/components/ui/card';
import { LucideProps } from 'lucide-react';

type InvitationCardProp = {
    data:number,
    title:string,
    colour:string,
    Icon:React.ComponentType<LucideProps>
}

export default function InviteStatsCard({data, title, colour, Icon}:InvitationCardProp){
    return (
        <Card className={`border-l-4 border-l-${colour}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{title}</p>
                  <p className="text-2xl font-bold text-gray-900">{data}</p>
                </div>
                <Icon className={`h-8 w-8 text-${colour}`} />
              </div>
            </CardContent>
          </Card>
    )
}