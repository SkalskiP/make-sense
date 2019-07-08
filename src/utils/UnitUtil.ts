export class UnitUtil {

    public static deg2rad(angleDeg:number) {
        return(angleDeg * Math.PI/180);
    }

    public static rad2deg(angleRad:number) {
        return(angleRad * 180/Math.PI);
    }
}