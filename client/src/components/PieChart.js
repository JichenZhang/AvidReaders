import { PieChart as Chart } from 'react-minimal-pie-chart'
export default function PieChart(params) {
	try {
		return <Chart {...params}/>
	}catch (e) {
		return <div>chart not available</div>
	}
}