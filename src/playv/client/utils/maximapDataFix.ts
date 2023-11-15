import alt from 'alt-client';

export function applyMapdataFix(){
	const mapZoomLevels = [{
		level: 'ZOOM_LEVEL_0',
		fZoomScale: 2.75,
		fZoomSpeed: 0.9,
		fScrollSpeed: 0.08,
		vTilesX: 0.0,
		vTilesY: 0.0,
	},
	{
		level: 'ZOOM_LEVEL_1',
		fZoomScale: 2.8,
		fZoomSpeed: 0.9,
		fScrollSpeed: 0.08,
		vTilesX: 0.0,
		vTilesY: 0.0,
	},
	{
		level: 'ZOOM_LEVEL_2',
		fZoomScale: 8.0,
		fZoomSpeed: 0.9,
		fScrollSpeed: 0.08,
		vTilesX: 0.0,
		vTilesY: 0.0,
	},
	{
		level: 'ZOOM_LEVEL_3',
		fZoomScale: 20.0,
		fZoomSpeed: 0.9,
		fScrollSpeed: 0.08,
		vTilesX: 0.0,
		vTilesY: 0.0,
	},
	{
		level: 'ZOOM_LEVEL_4',
		fZoomScale: 35.0,
		fZoomSpeed: 0.9,
		fScrollSpeed: 0.08,
		vTilesX: 0.0,
		vTilesY: 0.0,
	},
	{
		level: 'ZOOM_LEVEL_GOLF_COURSE',
		fZoomScale: 55.0,
		fZoomSpeed: 0.0,
		fScrollSpeed: 0.1,
		vTilesX: 2.0,
		vTilesY: 1.0,
	},
	{
		level: 'ZOOM_LEVEL_INTERIOR',
		fZoomScale: 450.0,
		fZoomSpeed: 0.0,
		fScrollSpeed: 0.1,
		vTilesX: 1.0,
		vTilesY: 1.0,
	},
	{
		level: 'ZOOM_LEVEL_GALLERY',
		fZoomScale: 4.5,
		fZoomSpeed: 0.0,
		fScrollSpeed: 0.0,
		vTilesX: 0.0,
		vTilesY: 0.0,
	},
	{
		level: 'ZOOM_LEVEL_GALLERY_MAXIMIZE',
		fZoomScale: 11.0,
		fZoomSpeed: 0.0,
		fScrollSpeed: 0.0,
		vTilesX: 2.0,
		vTilesY: 3.0,
	},

];

mapZoomLevels.forEach((zoom) => {
	const level = alt.MapZoomData.get(zoom.level);
	level.fZoomScale = zoom.fZoomScale;
	level.fZoomSpeed = zoom.fZoomSpeed;
	level.fScrollSpeed = zoom.fScrollSpeed;
	level.vTilesX = zoom.vTilesX;
	level.vTilesY = zoom.vTilesY;
});
}