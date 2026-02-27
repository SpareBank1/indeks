import OversiktEksempel from './OversiktEksempel';

export default function OpenPagesOverview() {
    return (
        <>
            <div className="ix-p-md ix-color-background-default">
                <OversiktEksempel title="Default Bakgrunn" />
            </div>
            <div className="ix-p-md ix-color-background-tinted">
                <OversiktEksempel title="Tinted Bakgrunn" />
            </div>
            <div className="ix-p-md ix-dark-mode ix-color-background-default">
                <OversiktEksempel title="Dark Bakgrunn" />
            </div>
            <div className="ix-p-md ix-dark-mode ix-color-background-tinted">
                <OversiktEksempel title="Dark Bakgrunn" />
            </div>
        </>
    );
}
